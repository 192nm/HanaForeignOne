// src/main/java/ac/kr/kopo/kopo_remittance/domain/admin/service/AdminService.java

package ac.kr.kopo.kopo_remittance.domain.admin.service;

import ac.kr.kopo.kopo_remittance.domain.admin.dto.AdminDTO;
import ac.kr.kopo.kopo_remittance.domain.admin.dto.UpdateTransactionStatusRequest;
import ac.kr.kopo.kopo_remittance.domain.admin.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final AdminMapper adminMapper;

    @Autowired
    public AdminService(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    // 모든 거래 조회
    public List<AdminDTO> getAllTransactions() {
        return adminMapper.selectAllTransactions();
    }

    // 거래 승인
    @Transactional
    public boolean approveTransaction(UpdateTransactionStatusRequest request) {
        Long transactionId = request.getTransactionId();
        AdminDTO transaction = adminMapper.selectTransactionById(transactionId);
        if (transaction != null && "대기".equals(transaction.getTranStatus())) {
            int rowsAffected = adminMapper.updateTransactionStatus(transactionId, "완료");
            return rowsAffected > 0;
        }
        return false;
    }

    // 거래 반려
    @Transactional
    public boolean rejectTransaction(UpdateTransactionStatusRequest request) {
        Long transactionId = request.getTransactionId();
        AdminDTO transaction = adminMapper.selectTransactionById(transactionId);
        if (transaction != null && "대기".equals(transaction.getTranStatus())) {
            int rowsAffected = adminMapper.updateTransactionStatus(transactionId, "반려");
            return rowsAffected > 0;
        }
        return false;
    }
}
