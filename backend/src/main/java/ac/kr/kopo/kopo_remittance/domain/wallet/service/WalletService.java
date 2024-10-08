package ac.kr.kopo.kopo_remittance.domain.wallet.service;

import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletInfoByIdDTO;
import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletInfoByIdResponse;
import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletOkInsertDTO;
import ac.kr.kopo.kopo_remittance.domain.wallet.mapper.WalletMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WalletService {
    private final WalletMapper walletMapper;



    @Autowired
    public WalletService(WalletMapper walletMapper) {
        this.walletMapper = walletMapper;
    }

    public boolean insertWalletOk(WalletOkInsertDTO walletOkInsertDTO) {
        return walletMapper.insertWalletOk(walletOkInsertDTO.getId(), walletOkInsertDTO.getWalletExist());
    }

    public int walletOkExist(String id) {
        return walletMapper.walletOkExist(id);
    }

    public List<WalletInfoByIdResponse> walletInfoById(String id) {
        return walletMapper.walletInfoById(id);
    }

}
