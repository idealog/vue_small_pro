/*eslint-disable*/
/**
 * Listen all the events and notify
 */

function Listener() {
    this.events = {};
    this.on = function (event, callback) {
        this.events[event] = callback;
    };

    this.do = function (event, data) {
        var callback = this.events[event];

        if (callback) {
            if (callback.object) {
                callback = callback.object[callback.method];
                if (callback) {
                    callback(data);
                }
            } else if (callback.context && callback.method) {
                callback.method(callback.context, data);
            } else {
                callback(data);
            }
        }
    };
}

/**
 * RS codec
 */

function RSCodec(m, gfpoly, k, prim, fr) {
    this.m = m;
    this.n = (1 << m) - 1;
    this.k = k;

    this.alpha_to = new Uint8Array(this.n + 1);
    this.index_of = new Uint8Array(this.n + 1);
    this.genfpoly = new Uint8Array(this.k + 1);

    this.alpha_0 = this.n;

    this.mod = function (value) {
        while (value >= this.n) {
            value -= this.n;
            value = (value >> this.m) + (value & this.n);
        }
        return value;
    };

    var alpha_i = 1;

    this.index_of[0] = this.alpha_0;
    this.alpha_to[this.alpha_0] = 0;

    for (var i = 0; i < this.n; i++) {
        this.alpha_to[i] = alpha_i;
        this.index_of[alpha_i] = i;

        alpha_i <<= 1;

        if (alpha_i & (1 << this.m)) {
            alpha_i ^= gfpoly;
        }

        alpha_i &= this.n;
    }

    if (alpha_i !== 1) {
        console.log(alpha_i);
    }

    this.genfpoly[0] = 1;

    var result = fr * prim;

    for (i = 0; i < this.k; i++, result += prim) {
        this.genfpoly[i + 1] = 1;

        for (var j = i; j > 0; j--) {
            if (this.genfpoly[j] !== 0) {
                this.genfpoly[j] = this.genfpoly[j - 1] ^ this.alpha_to[this.mod(this.index_of[this.genfpoly[j]] + result)];
            } else {
                this.genfpoly[j] = this.genfpoly[j - 1];
            }
        }

        this.genfpoly[0] = this.alpha_to[this.mod(this.index_of[this.genfpoly[0]] + result)];
    }

    for (i = 0; i < this.k + 1; i++) {
        this.genfpoly[i] = this.index_of[this.genfpoly[i]];
    }
}

RSCodec.prototype.encodeArray = function (data, parity) {
    for (var i = 0; i < data.length; i++) {
        var feedback = this.index_of[data[i] ^ parity[0]];

        if (feedback !== this.alpha_0) {
            for (var j = 1; j < parity.length; j++) {
                parity[j] ^= this.alpha_to[this.mod(feedback + this.genfpoly[parity.length - j])];
            }
        }

        for (var k = 0; k < parity.length - 1; k++) {
            parity[k] = parity[k + 1];
        }

        if (feedback !== this.alpha_0) {
            parity[parity.length - 1] = this.alpha_to[this.mod(feedback + this.genfpoly[0])];
        } else {
            parity[parity.length - 1] = 0;
        }
    }
};

/**
 * RS codec wrapper
 */

var RSDefaultConfig = {
    block_length: 10,
    begin_tag: [0xf, 0xf],
    symbol_bits: 8,
    gfpoly: 285,
    fcr: 1,
    prim: 1,
    correct_number: 4
};

function RSEncoder(config) {
    Listener.call(this);
    Object.assign(this, RSDefaultConfig, config);

    this.rscodec = new RSCodec(this.symbol_bits, this.gfpoly, this.correct_number * 2, this.prim, this.fcr);
}

/**
 * Encode data and split the data into Fixed TAG + DATA + END + RSCODE combinations

 * @param  {string} target the encoded data
 */
RSEncoder.prototype.encode = function (target) {
    var buffer = new Uint8Array(this.block_length + this.begin_tag.length + 1);
    var parity = new Uint8Array(this.correct_number * 2);
    var i;
    var j;

    for (j in this.begin_tag) {
        buffer[j] = this.begin_tag[j];
    }

    for (i = 0; i < target.length;) {
        for (j = this.begin_tag.length; j < buffer.length && i < target.length; j++, i++) {
            if (target instanceof String) {
                buffer[j] = target.charCodeAt(i);
            } else {
                buffer[j] = target[i];
            }
        }
        for (; j < buffer.length; j++) {
            buffer[j] = 0;
        }
        buffer[j] = 0;
        this.do('data', buffer);

        this.rscodec.encodeArray(buffer, parity);

        this.do('data', parity);
    }
};

RSEncoder.prototype.rscode = function (target) {
};

/**
 * Hamming window for generate the tone by frequency
 *
 * @param  {int} freq        the frequency want to encode
 * @param  {int} sample_rate target sample rate
 * @param  {int} index       the index of the sample
 * @param  {int} length      the samples length
 * @return {float} the PCM float data
 */
function hamming(freq, sample_rate, index, length) {
    var hamming_coef = Hamming.COEF1 - Hamming.COEF2 * Math.sin(Math.PI / 2 - 2 * Math.PI * index / (length - 1));
    var amplitude = Math.sin(2 * Math.PI * freq * index / sample_rate);
    return amplitude * hamming_coef;
}

/**
 * WAV Formatter
 */

var WAVFormatterConfigDef = {
    sample_rate: 44100,
    bits_per_sample: 16,
    channels: 1,
};

function WAVFormatter(config) {
    Object.assign(this, WAVFormatterConfigDef, config);

    this.output = [];
    this.size = 0;

    this.writeString = function (value) {
        for (var i = 0; i < value.length; i++) {
            this.output.push(value[i].charCodeAt());
        }
    };

    this.writeInt = function (value, bytes, from) {
        while (bytes > 0) {
            if (!from && from !== 0) {
                this.output.push(value & 0xff);
            } else {
                this.output[from++] = value & 0xff;
            }
            value >>= 8;
            bytes--;
        }
    };
}

WAVFormatter.prototype.writeFloat32Array = function (array) {
    for (var i = 0; i < array.length; i++) {
        var sample = array[i];
        var value = Math.round(sample * (1 << (this.bits_per_sample - 1)));
        var channels = this.channels;
        while (channels-- > 0) {
            this.writeInt(value, this.bits_per_sample / 8);
        }
    }
    this.size += array.length * this.bits_per_sample / 8;
};

WAVFormatter.prototype.reset = function () {
    this.output.splice(0, this.output.length);
    this.size = 0;

    this.writeString('RIFF');
    this.writeInt(0, 4);
    this.writeString('WAVEfmt ');
    this.writeInt(0x10, 4);
    this.writeInt(0x01, 2);
    this.writeInt(this.channels, 2);
    this.writeInt(this.sample_rate, 4);
    this.writeInt(this.sample_rate * this.bits_per_sample * this.channels / 8, 4);
    this.writeInt(this.bits_per_sample / 8 * this.channels, 2);
    this.writeInt(this.bits_per_sample, 2);
    this.writeString('data');
    this.writeInt(0, 4);
};

WAVFormatter.prototype.obtain = function () {
    this.writeInt(this.size + 38, 4, 4);
    this.writeInt(this.size, 4, 40);

    return new Uint8Array(this.output);
};

/**
 * PCM Builder Configuation Blow
 */

const FrequencyRange = {
    LOW: [2104, 2213, 2328, 2449, 2577, 2711, 2852, 3000, 3156, 3320, 3493, 3674, 3865, 4066, 4278, 4500],
    MIDDLE: [8662, 8827, 8996, 9167, 9342, 9520, 9702, 9887, 10075, 10268, 10463, 10663, 10866, 11074, 11285, 11500],
    HIGH: [16673, 16848, 17025, 17204, 17384, 17567, 17751, 17937, 18126, 18316, 18508, 18702, 18899, 19097, 19297, 19500]
};

const SyncWordRange = {
    LOW: [1719, 1719],
    MIDDLE: [7734, 7734],
    HIGH: [11703, 11703]
};

const FrequencyRangeTag = {
    LOW: 'LOW',
    MIDDLE: 'MIDDLE',
    HIGH: 'HIGH'
};

const SampleRate = {
    RATE_11025_HZ: 11025,
    RATE_16000_HZ: 16000,
    RATE_22050_HZ: 22050,
    RATE_24000_HZ: 24000,
    RATE_32000_HZ: 32000,
    RATE_44100_HZ: 44100,
    RATE_48000_HZ: 48000
};

const Hamming = {
    COEF1: 0.54,
    COEF2: 0.46
};

var PCMBuilderDefConfig = {
    freq_range: FrequencyRangeTag.LOW,
    sample_rate: SampleRate.RATE_16000_HZ,
    encoder: new RSEncoder(),
    symbol_frame_total: null,
    symbol_sample_total: null,
    freq_select: null,
    sync_word: null,
    formatter: new WAVFormatter({bits_per_sample: 16, channels: 1})
};

function on_data(builder, data) {
    for (var e in data) {
        var value = data[e];
        for (var i = 0; i < 2; i++) {
            builder.encode_freq(builder.freq_select[value & 0xf]);
            value = value >> 4;
        }
    }
}

function PCMBuilder(config) {
    Listener.call(this);
    Object.assign(this, PCMBuilderDefConfig, config);

    if (this.formatter) {
        this.formatter.sample_rate = this.sample_rate;
    }

    if (this.symbol_frame_total) {
        this.symbol_sample_total = this.sample_rate * 20 / 1000 * this.symbol_frame_total;
        console.log('sample total: ', this.symbol_sample_total);
    }

    if (!this.symbol_sample_total) {
        this.symbol_sample_total = 1024;

        switch (this.sample_rate) {
            case SampleRate.RATE_44100_HZ:
            case SampleRate.RATE_48000_HZ:
                this.symbol_sample_total *= 4;
                break;
            case SampleRate.RATE_22050_HZ:
            case SampleRate.RATE_24000_HZ:
            case SampleRate.RATE_32000_HZ:
                this.symbol_sample_total *= 2;
                break;
            case SampleRate.RATE_11025_HZ:
            case SampleRate.RATE_16000_HZ:
                break;
            default:
                console.log('error sample rate!!!');
        }

        console.log(this.symbol_sample_total);
    }

    if (!this.freq_select) {
        this.freq_select = FrequencyRange[this.freq_range];
    }

    if (!this.sync_word) {
        this.sync_word = SyncWordRange[this.freq_range];
    }

    this.encoder.on('data', {context: this, method: on_data});
}

PCMBuilder.prototype.encode_freq = function (freq) {
    var buffer = new Float32Array(this.symbol_sample_total);

    for (var i = 0; i < this.symbol_sample_total; i++) {
        buffer[i] = hamming(freq, this.sample_rate, i, this.symbol_sample_total);
    }

    if (!this.formatter) {
        this.do('data', buffer);
    } else {
        this.formatter.writeFloat32Array(buffer);
    }
};

PCMBuilder.prototype.build = function (target) {
    if (this.formatter) {
        this.formatter.reset();
    }

    for (var i = 0; i < this.sync_word.length; i++) {
        this.encode_freq(this.sync_word[i]);
    }
    // for (let i of this.sync_word) {
    //     this.encode_freq(i);
    // }

    this.encoder.encode(target);

    if (this.formatter) {
        this.do('data', this.formatter.obtain());
    }
};
