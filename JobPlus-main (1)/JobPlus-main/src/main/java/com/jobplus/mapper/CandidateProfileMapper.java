package com.jobplus.mapper;

import com.jobplus.entity.CandidateProfile;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CandidateProfileMapper {

    @Select("""
        SELECT id, user_id, address, education, experience_summary, avatar_url, linkedin_url, github_url, updated_at
        FROM candidate_profiles
        WHERE user_id = #{userId}
        """)
    CandidateProfile findByUserId(Long userId);

    @Insert("""
        INSERT INTO candidate_profiles (user_id, address, education, experience_summary, avatar_url, linkedin_url, github_url, updated_at)
        VALUES (#{userId}, #{address}, #{education}, #{experienceSummary}, #{avatarUrl}, #{linkedinUrl}, #{githubUrl}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(CandidateProfile candidateProfile);

    @Update("""
        UPDATE candidate_profiles
        SET address = #{address},
            education = #{education},
            experience_summary = #{experienceSummary},
            avatar_url = #{avatarUrl},
            linkedin_url = #{linkedinUrl},
            github_url = #{githubUrl},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = #{userId}
        """)
    int update(CandidateProfile candidateProfile);
}
