import { Repository } from "typeorm";
import { Payment } from "../entity";
import { PaumentData } from "../types";

class PaymentService {
    constructor(private paymentRepository: Repository<Payment>) {}

    async orderPayment(payment: PaumentData) {
        return await this.paymentRepository.save(payment);
    }
}

export default PaymentService;
