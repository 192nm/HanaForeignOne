package ac.kr.kopo.kopo_remittance.domain.account.service;

import ac.kr.kopo.kopo_remittance.domain.account.dto.AccountSelectByIdDTO;
import ac.kr.kopo.kopo_remittance.domain.account.mapper.AccountMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final AccountMapper accountMapper;

    @Autowired
    public AccountService(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    public List<AccountSelectByIdDTO> accountSelectByIdDTOS(String id) {
        return accountMapper.accountSelectById(id);
    }
}
