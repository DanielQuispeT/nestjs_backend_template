export interface Payload_Access {
  sub: string;
  email: string;
  nombres: string;
  apellidos: string;
  foto_perfil: string;
  suscripcion_activa: boolean;
  rol_activo: string;
  roles: string[];
}

export interface Payload_Refresh {
  sub: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  permissions: string[];
}
