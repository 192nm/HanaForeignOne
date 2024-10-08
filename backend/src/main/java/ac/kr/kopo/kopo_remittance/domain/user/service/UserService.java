package ac.kr.kopo.kopo_remittance.domain.user.service;

import ac.kr.kopo.kopo_remittance.domain.user.entity.NoProfileEntity;
import ac.kr.kopo.kopo_remittance.domain.user.entity.UserEntity;
import ac.kr.kopo.kopo_remittance.domain.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Blob;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public boolean isUserExist(String userId) {
        return userMapper.isUserExist(userId);
    }

    public boolean joinUser(NoProfileEntity noProfileEntity) {
        return userMapper.joinUser(
                noProfileEntity.getUserNo(),
                noProfileEntity.getId(),
                noProfileEntity.getPw(),
                noProfileEntity.getName(),
                noProfileEntity.getPhone(),
                noProfileEntity.getEmail(),
                noProfileEntity.getEngName(),
                noProfileEntity.getIdentifyNo(),
                noProfileEntity.getAddress()
        );
    }

    public boolean loginUser(String Id, String pw) {
        int count = userMapper.loginUser(Id, pw);
        return count>0;
    }

    public String selectUserById(String id) {
        return userMapper.selectUserById(id);
    }
    public List<UserEntity> getUserProfile(String id) {
        return userMapper.getUserProfile(id);
    }
    public boolean updateUserProfile(String id, MultipartFile profileImage) {
        try {
            // MultipartFile을 byte[]로 변환
            byte[] imageBytes = profileImage.getBytes();

            // 매퍼 호출하여 DB에 이미지 저장
            return userMapper.updateUserProfile(id, imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
