// src/main/java/ac/kr/kopo/kopo_remittance/domain/admin/mapper/AdminMapper.java

package ac.kr.kopo.kopo_remittance.domain.admin.mapper;

import ac.kr.kopo.kopo_remittance.domain.admin.dto.AdminDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminMapper {
    List<AdminDTO> selectAllTransactions();

    // TRANSACTION_ID로 거래 조회
    AdminDTO selectTransactionById(@Param("transactionId") Long transactionId);

    // TRANSACTION_ID로 TRAN_STATUS 업데이트
    int updateTransactionStatus(@Param("transactionId") Long transactionId, @Param("tranStatus") String tranStatus);
}
