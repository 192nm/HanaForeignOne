package ac.kr.kopo.kopo_remittance.domain.logged.mapper;

import ac.kr.kopo.kopo_remittance.domain.logged.dto.FxLogDTO;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.RemiAllLog;
import ac.kr.kopo.kopo_remittance.domain.logged.dto.RemiLogDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface LoggedMapper {
    List<FxLogDTO> fxLogById(@Param("id") String id);

    List<RemiLogDTO> findRemittanceLogsById(String id);

    List<RemiAllLog> remiLogGet(@Param("id") String id);
}
