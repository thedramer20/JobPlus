package com.jobplus.mapper;

import com.jobplus.entity.OAuthAccount;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface OAuthAccountMapper {

    @Select("""
        SELECT id, user_id, provider, provider_user_id, provider_email, linked_at, last_login_at
        FROM oauth_accounts
        WHERE provider = #{provider} AND provider_user_id = #{providerUserId}
        """)
    OAuthAccount findByProviderAndProviderUserId(@Param("provider") String provider, @Param("providerUserId") String providerUserId);

    @Select("""
        SELECT id, user_id, provider, provider_user_id, provider_email, linked_at, last_login_at
        FROM oauth_accounts
        WHERE user_id = #{userId} AND provider = #{provider}
        """)
    OAuthAccount findByUserIdAndProvider(@Param("userId") Long userId, @Param("provider") String provider);

    @Select("""
        SELECT id, user_id, provider, provider_user_id, provider_email, linked_at, last_login_at
        FROM oauth_accounts
        WHERE user_id = #{userId}
        ORDER BY linked_at DESC
        """)
    List<OAuthAccount> findByUserId(Long userId);

    @Insert("""
        INSERT INTO oauth_accounts (user_id, provider, provider_user_id, provider_email, linked_at, last_login_at)
        VALUES (#{userId}, #{provider}, #{providerUserId}, #{providerEmail}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(OAuthAccount account);

    @Update("""
        UPDATE oauth_accounts
        SET provider_email = #{providerEmail},
            last_login_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int updateLastLogin(OAuthAccount account);

    @Delete("""
        DELETE FROM oauth_accounts
        WHERE user_id = #{userId} AND provider = #{provider}
        """)
    int deleteByUserIdAndProvider(@Param("userId") Long userId, @Param("provider") String provider);
}
