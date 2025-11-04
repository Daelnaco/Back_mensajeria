export declare class Chat {
    idChat: number;
    idComprador?: number;
    idVendedor?: number;
    contenido: string;
    fechaMensaje?: string;
    senderId?: number;
    orderId?: number;
    postId?: number;
    isVisible: boolean;
    isFlagged: boolean;
    isDeleted: boolean;
    createdAt: Date;
}
