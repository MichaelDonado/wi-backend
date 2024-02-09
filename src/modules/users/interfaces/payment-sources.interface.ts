export interface PaymentSources{
    typePayment: TypePayment,
    cardToken: string
}

export enum TypePayment {
    card = 'card',
    nequi = 'nequi'
} 