import { HTTPTransport } from '../core/http-transport';

const API_HOST = 'ya-praktikum.tech';
const API_URL = `https://${API_HOST}/api/v2`;

export const RESOURCES_URL = `${API_URL}/resources`;

export const CHATS_SOCKET_URL = `wss://${API_HOST}/ws/chats`;

export const http = new HTTPTransport(API_URL);
