package ac.kr.kopo.kopo_remittance.domain.wallet.mapper;

import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletInfoByIdDTO;
import ac.kr.kopo.kopo_remittance.domain.wallet.dto.WalletInfoByIdResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WalletMapper {
    boolean insertWalletOk(String id, String walletExist);
    int walletOkExist(String id);
    List<WalletInfoByIdResponse> walletInfoById(String id);

}
