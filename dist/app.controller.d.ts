interface HealthResponse {
    status: 'ok';
    service: string;
}
export declare class AppController {
    getHealth(): HealthResponse;
}
export {};
