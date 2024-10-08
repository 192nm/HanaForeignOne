package ac.kr.kopo.kopo_remittance.domain.docu.service;

import ac.kr.kopo.kopo_remittance.domain.docu.dto.DocuDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.dto.ImageDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.dto.UpdateDTO;
import ac.kr.kopo.kopo_remittance.domain.docu.mapper.DocuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class DocuService {

    @Autowired
    private DocuMapper docuMapper;

    public void saveDocu(DocuDTO docuDTO) {
        docuMapper.insertDocu(docuDTO);
    }

    public boolean updateDocu(String id, MultipartFile attachedImage) {
        try{
            byte[] attachedImageBytes = attachedImage.getBytes();

            return docuMapper.updateDocu(id, attachedImageBytes);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<ImageDTO> selectDocu(String id) {
        return docuMapper.selectDocu(id);
    }
}
