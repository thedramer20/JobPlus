package com.jobplus.mapper;

import com.jobplus.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("""
        SELECT id, username, full_name, email, password_hash AS password, phone, role, status, created_at, updated_at
        FROM users
        WHERE username = #{username}
        """)
    User findByUsername(String username);

    @Select("""
        SELECT id, username, full_name, email, password_hash AS password, phone, role, status, created_at, updated_at
        FROM users
        WHERE id = #{id}
        """)
    User findById(Long id);

    @Select("SELECT COUNT(*) > 0 FROM users WHERE username = #{username}")
    boolean existsByUsername(String username);

    @Select("SELECT COUNT(*) > 0 FROM users WHERE email = #{email}")
    boolean existsByEmail(String email);

    @Select("""
        SELECT id, username, full_name, email, password_hash AS password, phone, role, status, created_at, updated_at
        FROM users
        WHERE email = #{email}
        """)
    User findByEmail(String email);

    @Select("""
        SELECT id, username, full_name, email, password_hash AS password, phone, role, status, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        """)
    List<User> findAll();

    @Select("SELECT COUNT(*) FROM users")
    long countAll();

    @Insert("""
        INSERT INTO users (username, full_name, email, password_hash, phone, role, status, created_at, updated_at)
        VALUES (#{username}, #{fullName}, #{email}, #{password}, #{phone}, #{role}, #{status}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("""
        UPDATE users
        SET full_name = #{fullName},
            email = #{email},
            phone = #{phone},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int updateProfile(User user);

    @Update("""
        UPDATE users
        SET password_hash = #{passwordHash},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int updatePasswordHash(@Param("id") Long id, @Param("passwordHash") String passwordHash);
}
