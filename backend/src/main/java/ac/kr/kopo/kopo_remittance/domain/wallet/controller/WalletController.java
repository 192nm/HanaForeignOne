package ac.kr.kopo.kopo_remittance.domain.wallet.controller;

import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletInfoByIdDTO;
import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletInfoByIdResponse;
import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletOkExistDTO;
import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletOkInsertDTO;
import ac.kr.kopo.kopo_remittance.domain.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WalletController {

    private final WalletService walletService;


    @Autowired
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/insertWalletOk")
    public String insertWalletOk(@RequestBody WalletOkInsertDTO walletOkInsertDTO) {
        boolean isInserted = walletService.insertWalletOk(walletOkInsertDTO);
        if (isInserted) {
            return "지갑 생성에 성공하였습니다";
        } else {
            return "지갑 생성에 실패하였습니다";
        }
    }

    @PostMapping("/walletOkExist")
    public int walletOkExist(@RequestBody String id) {
        int walletExist = walletService.walletOkExist(id);
        System.out.println("나는: " +  walletExist);
        return walletExist;
    }

    @PostMapping("/walletInfoById")
    public List<WalletInfoByIdResponse> walletInfoById(@RequestBody WalletInfoByIdDTO walletInfoByIdDTO) {
        return walletService.walletInfoById(walletInfoByIdDTO.getId());
    }


}
