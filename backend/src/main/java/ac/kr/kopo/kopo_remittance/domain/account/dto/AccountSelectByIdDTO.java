package ac.kr.kopo.kopo_remittance.domain.account.dto;

import lombok.Data;

@Data
public class AccountSelectByIdDTO {
    private Long accountNo;
    private String accountType;
    private String bank;
    
}
