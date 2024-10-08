package ac.kr.kopo.kopo_remittance.domain.docu.mapper;

import ac.kr.kopo.kopo_remittance.domain.docu.dto.DocuDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.dto.ImageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DocuMapper {
    void insertDocu(DocuDTO docuDTO);
    boolean updateDocu(@Param("id") String id, @Param("attachedImage") byte[] attachedImage);
    List<ImageDTO> selectDocu(String id);
}
