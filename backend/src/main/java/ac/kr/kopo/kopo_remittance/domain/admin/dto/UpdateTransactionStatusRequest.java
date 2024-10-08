// src/main/java/ac/kr/kopo/kopo_remittance/domain/admin/dto/UpdateTransactionStatusRequest.java

package ac.kr.kopo.kopo_remittance.domain.admin.dto;

import lombok.Data;

@Data
public class UpdateTransactionStatusRequest {
    private Long transactionId; // TRANSACTION_ID
    private String status;      // 승인("완료") 또는 거절("반려")
}
