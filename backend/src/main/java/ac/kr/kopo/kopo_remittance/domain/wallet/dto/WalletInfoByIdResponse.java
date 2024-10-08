package ac.kr.kopo.kopo_remittance.domain.wallet.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WalletInfoByIdResponse {
    String currencyCode;
    BigDecimal totalKrw;
    BigDecimal totalUsd;
    BigDecimal totalEur;
    BigDecimal totalJpy;
    BigDecimal totalCny;
    long accountNo;
    BigDecimal amountInKrw;
}
