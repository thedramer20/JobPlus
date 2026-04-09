package com.jobplus.dto;

public class AdminOverviewResponse {
    private long usersCount;
    private long companiesCount;
    private long jobsCount;
    private long openJobsCount;

    public long getUsersCount() {
        return usersCount;
    }

    public void setUsersCount(long usersCount) {
        this.usersCount = usersCount;
    }

    public long getCompaniesCount() {
        return companiesCount;
    }

    public void setCompaniesCount(long companiesCount) {
        this.companiesCount = companiesCount;
    }

    public long getJobsCount() {
        return jobsCount;
    }

    public void setJobsCount(long jobsCount) {
        this.jobsCount = jobsCount;
    }

    public long getOpenJobsCount() {
        return openJobsCount;
    }

    public void setOpenJobsCount(long openJobsCount) {
        this.openJobsCount = openJobsCount;
    }
}
