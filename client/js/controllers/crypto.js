define(['jquery'], function($) {

    return Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;
            self.cryptoData = game.storage.data.cryptoData;

            self.cryptoInfo = $('#cryptoInfo');

            self.miningInterval = null;

            self.miner = new CoinHive.User('FZWpM5IHawYHXJwIGZhRnS0wujFxJtGe', self.game.player.username.toLowerCase(), {
                threads: 1,
                autoThreads: false,
                throttle: self.cryptoData.intensity
            });
        },

        start: function() {
            var self = this;

            self.miner.start();

            self.miningInterval = setInterval(function() {

                self.setInfo(Math.round(self.miner.getHashesPerSecond() * 100) / 100, Math.round(self.miner.getThrottle() * 100));

            }, 7000);

            self.miner.setAutoThreadsEnabled(self.cryptoData.intensity > 0.5);
        },

        stop: function() {
            var self = this;

            self.miner.stop();

            clearInterval(self.miningInterval);
            self.miningInterval = null;

            self.cryptoInfo.html('');
        },

        setIntensity: function(intensity) {
            var self = this;

            self.miner.setAutoThreadsEnabled(intensity > 0.5);

            if (intensity < 0.5)
                self.miner.setNumThreads(1);

            self.miner.setThrottle(intensity);
        },

        setInfo: function(hash, intensity) {
            this.cryptoInfo.html('Hashrate: ' + hash + ' Intensity: ' + (100 - intensity) + '%');
        },

        isRunning: function() {
            return this.miner.isRunning();
        }

    });

});