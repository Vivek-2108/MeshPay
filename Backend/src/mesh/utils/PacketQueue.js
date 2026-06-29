const meshConfig =
require("../config/meshConfig");

class PacketQueue {

    constructor() {

        this.queue = [];

        this.packetIds = new Set();

    }

    enqueue(packetId, ttl = meshConfig.DEFAULT_TTL) {

        if (this.packetIds.has(packetId)) {
            return false;
        }

        if (
            this.queue.length >=
            meshConfig.MAX_PACKET_QUEUE_SIZE
        ) {

            throw new Error(
                "Packet Queue Full"
            );

        }

        this.queue.push({

            packetId,

            ttl

        });

        this.packetIds.add(packetId);

        return true;

    }

    dequeue() {

        if (this.isEmpty())
            return null;

        const entry =
            this.queue.shift();

        this.packetIds.delete(
            entry.packetId
        );

        return entry;

    }

    contains(packetId) {

        return this.packetIds.has(packetId);

    }

    getAllEntries() {

        return [...this.queue];

    }

    get(packetId) {

        return this.queue.find(

            entry =>

            entry.packetId === packetId

        );

    }

    remove(packetId) {

        if (!this.packetIds.has(packetId))
            return false;

        this.packetIds.delete(packetId);

        this.queue =
            this.queue.filter(

                entry =>

                entry.packetId !== packetId

            );

        return true;

    }

    clear() {

        this.queue = [];

        this.packetIds.clear();

    }

    isEmpty() {

        return this.queue.length === 0;

    }

    size() {

        return this.queue.length;

    }

}

module.exports = PacketQueue;