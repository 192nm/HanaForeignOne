package ac.kr.kopo.kopo_remittance.domain.account.mapper;

import ac.kr.kopo.kopo_remittance.domain.account.dto.AccountSelectByIdDTO;
import ac.kr.kopo.kopo_remittance.domain.user.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccountMapper {
    List<AccountSelectByIdDTO> accountSelectById(String id);

}
