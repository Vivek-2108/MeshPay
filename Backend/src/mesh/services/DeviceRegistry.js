class DeviceRegistry {

    constructor() {
        this.devices = new Map();
    }

    /**
     * Register a new device
     */
    register(device) {

        if (this.devices.has(device.deviceId)) {
            throw new Error(
                `Device '${device.deviceId}' already exists.`
            );
        }

        this.devices.set(device.deviceId, device);

        return device;
    }

    /**
     * Get device by ID
     */
    get(deviceId) {
        return this.devices.get(deviceId) || null;
    }

    /**
     * Check if device exists
     */
    exists(deviceId) {
        return this.devices.has(deviceId);
    }

    /**
     * Connect two devices
     */
    connect(deviceIdA, deviceIdB) {

        if (deviceIdA === deviceIdB) {
            throw new Error(
                "A device cannot connect to itself."
            );
        }

        const deviceA = this.get(deviceIdA);
        const deviceB = this.get(deviceIdB);

        if (!deviceA || !deviceB) {
            throw new Error(
                "One or both devices do not exist."
            );
        }

        deviceA.addNeighbor(deviceIdB);
        deviceB.addNeighbor(deviceIdA);
    }

    /**
     * Disconnect two devices
     */
    disconnect(deviceIdA, deviceIdB) {

        const deviceA = this.get(deviceIdA);
        const deviceB = this.get(deviceIdB);

        if (!deviceA || !deviceB) {
            return;
        }

        deviceA.removeNeighbor(deviceIdB);
        deviceB.removeNeighbor(deviceIdA);
    }

    /**
     * Return neighboring device objects
     */
    getNeighbors(deviceId) {

        const device = this.get(deviceId);

        if (!device) {
            return [];
        }

        return device.neighbors
            .map(id => this.get(id))
            .filter(Boolean);
    }

    /**
     * Remove device from registry
     */
    remove(deviceId) {

        const device = this.get(deviceId);

        if (!device) {
            return false;
        }

        // Remove this device from every neighbor
        for (const neighborId of device.neighbors) {

            const neighbor = this.get(neighborId);

            if (neighbor) {
                neighbor.removeNeighbor(deviceId);
            }
        }

        this.devices.delete(deviceId);

        return true;
    }

    /**
     * Return all devices
     */
    getAllDevices() {
        return [...this.devices.values()];
    }

    /**
     * Return all online devices
     */
    getOnlineDevices() {

        return this.getAllDevices().filter(
            device => device.isOnline
        );

    }

    /**
     * Return all bridge devices
     */
    getBridgeDevices() {

        return this.getAllDevices().filter(
            device => device.hasInternet
        );

    }

    /**
     * Reset network
     */
    clear() {

        this.devices.clear();

    }

    /**
     * Number of devices
     */
    size() {

        return this.devices.size;

    }

}

module.exports = new DeviceRegistry();