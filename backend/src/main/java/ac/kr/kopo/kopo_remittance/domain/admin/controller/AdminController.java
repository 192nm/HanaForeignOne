// src/main/java/ac/kr/kopo/kopo_remittance/domain/admin/controller/AdminController.java

package ac.kr.kopo.kopo_remittance.domain.admin.controller;

import ac.kr.kopo.kopo_remittance.domain.admin.dto.AdminDTO;
import ac.kr.kopo.kopo_remittance.domain.admin.dto.UpdateTransactionStatusRequest;
import ac.kr.kopo.kopo_remittance.domain.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // 모든 거래 조회
    @PostMapping("/transactions")
    public ResponseEntity<List<AdminDTO>> getAllTransactions() {
        List<AdminDTO> transactions = adminService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // 거래 승인
    @PostMapping("/transactions/approve")
    public ResponseEntity<String> approveTransaction(@RequestBody UpdateTransactionStatusRequest request) {
        boolean isApproved = adminService.approveTransaction(request);
        if (isApproved) {
            return ResponseEntity.ok("거래가 성공적으로 승인되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("거래를 승인할 수 없습니다.");
        }
    }

    // 거래 반려
    @PostMapping("/transactions/reject")
    public ResponseEntity<String> rejectTransaction(@RequestBody UpdateTransactionStatusRequest request) {
        boolean isRejected = adminService.rejectTransaction(request);
        if (isRejected) {
            return ResponseEntity.ok("거래가 성공적으로 반려되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("거래를 반려할 수 없습니다.");
        }
    }
}
