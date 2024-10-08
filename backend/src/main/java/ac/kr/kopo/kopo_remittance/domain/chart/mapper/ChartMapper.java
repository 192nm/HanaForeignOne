package ac.kr.kopo.kopo_remittance.domain.chart.mapper;

import ac.kr.kopo.kopo_remittance.domain.chart.dto.ChartDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChartMapper {
    List<ChartDTO> showchartData(String tableName);
}