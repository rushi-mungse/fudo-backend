import { Repository } from "typeorm";
import { Payment } from "../entity";
import { Service, PaymentData } from "../types/type";

class PaymentService implements Service<Payment, PaymentData> {
    constructor(private paymentRepository: Repository<Payment>) {}

    async save(payment: PaymentData): Promise<Payment> {
        return await this.paymentRepository.save(payment);
    }

    async getById(paymentId: number): Promise<Payment | null> {
        return await this.paymentRepository.findOne({
            where: { id: paymentId },
        });
    }

    async gets(): Promise<Payment[]> {
        return await this.paymentRepository.find();
    }

    async delete(paymentId: number): Promise<void> {
        await this.paymentRepository.delete(paymentId);
    }
}

export default PaymentService;
