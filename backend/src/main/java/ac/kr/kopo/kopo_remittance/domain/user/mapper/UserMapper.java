package ac.kr.kopo.kopo_remittance.domain.user.mapper;

import ac.kr.kopo.kopo_remittance.domain.user.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    boolean isUserExist(String userId);
    boolean joinUser(int userNo, String id, String pw, String name, String phone, String email, String engName, String identifyNo, String address);
    int loginUser(String id, String pw);
    String selectUserById(String id);
    List<UserEntity> getUserProfile(String id);
    boolean updateUserProfile(@Param("id") String id, @Param("profile") byte[] profile);
}
