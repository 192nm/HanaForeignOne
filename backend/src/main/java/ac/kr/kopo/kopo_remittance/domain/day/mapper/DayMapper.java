package ac.kr.kopo.kopo_remittance.domain.day.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.sql.Date;
import java.util.List;

@Mapper
public interface DayMapper {
    List<Date> getAllDays();
}
