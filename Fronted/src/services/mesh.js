import api from './api';

export const sendPacket = async (deviceId, sender, receiver, amount) => {
  const response = await api.post('/mesh/send', { deviceId, sender, receiver, amount });
  return response.data;
};

export const runGossip = async () => {
  const response = await api.post('/mesh/gossip');
  return response.data;
};

export const flushPackets = async () => {
  const response = await api.post('/mesh/flush');
  return response.data;
};

export const resetMeshSimulation = async () => {
  const response = await api.post('/mesh/reset');
  return response.data;
};

export const getMeshDevices = async () => {
  const response = await api.get('/mesh/devices');
  return response.data;
};

export const toggleDeviceStatus = async (deviceId) => {
  const response = await api.post('/mesh/toggle-device', { deviceId });
  return response.data;
};

export const ingestPackets = async (packets) => {
  const response = await api.post('/bridge/ingest', { packets });
  return response.data;
};
