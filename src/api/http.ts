import { HTTPTransport } from '../core/http-transport';

const API_URL = 'https://ya-praktikum.tech/api/v2';

export const RESOURCES_URL = `${API_URL}/resources`;

export const http = new HTTPTransport(API_URL);
