import { Repository } from "typeorm";
import { Payment } from "../../entity";
import { PaymentData } from "../../types";

class PaymentService {
    constructor(private paymentRepository: Repository<Payment>) {}

    async orderPayment(payment: PaymentData) {
        return await this.paymentRepository.save(payment);
    }
}

export default PaymentService;
