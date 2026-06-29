class PacketStore {

    constructor() {

        this.packets = new Map();

    }

    add(packet) {

        this.packets.set(
            packet.packetId,
            packet
        );

        return packet;

    }

    get(packetId) {

        return this.packets.get(packetId) || null;

    }

    has(packetId) {

        return this.packets.has(packetId);

    }

    remove(packetId) {

        return this.packets.delete(packetId);

    }

    getAll() {

        return [...this.packets.values()];

    }

    clear() {

        this.packets.clear();

    }

    size() {

        return this.packets.size;

    }

}

module.exports = new PacketStore();