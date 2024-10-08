package ac.kr.kopo.kopo_remittance.domain.account.controller;

import ac.kr.kopo.kopo_remittance.domain.account.dto.AccountSelectByIdDTO;

import ac.kr.kopo.kopo_remittance.domain.account.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AccountController {

    private AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {  // 생성자를 통한 의존성 주입
        this.accountService = accountService;
    }

    @PostMapping("/accountSelectById")
    public List<AccountSelectByIdDTO> selectAccountById(@RequestBody Map<String, String> request) {
        String userId = request.get("id");
        return accountService.accountSelectByIdDTOS(userId);  // JSON 형식으로 반환
    }

}
