package com.jobplus.mapper;

import com.jobplus.entity.Company;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CompanyMapper {

    @Insert("""
        INSERT INTO companies (
            owner_user_id, company_name, description, industry, location, website, logo_url, company_size, status, created_at, updated_at
        )
        VALUES (
            #{ownerUserId}, #{companyName}, #{description}, #{industry}, #{location}, #{website}, #{logoUrl}, #{companySize}, #{status},
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Company company);

    @Select("""
        SELECT c.id, c.owner_user_id, u.username AS owner_username, c.company_name, c.description, c.industry, c.location,
               c.website, c.logo_url, c.company_size, c.status, c.created_at, c.updated_at
        FROM companies c
        JOIN users u ON u.id = c.owner_user_id
        WHERE c.id = #{id}
        """)
    Company findById(Long id);

    @Select("""
        SELECT c.id, c.owner_user_id, u.username AS owner_username, c.company_name, c.description, c.industry, c.location,
               c.website, c.logo_url, c.company_size, c.status, c.created_at, c.updated_at
        FROM companies c
        JOIN users u ON u.id = c.owner_user_id
        WHERE c.owner_user_id = #{ownerUserId}
        """)
    Company findByOwnerUserId(Long ownerUserId);

    @Update("""
        UPDATE companies
        SET company_name = #{companyName},
            description = #{description},
            industry = #{industry},
            location = #{location},
            website = #{website},
            logo_url = #{logoUrl},
            company_size = #{companySize},
            status = #{status},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int update(Company company);
}
