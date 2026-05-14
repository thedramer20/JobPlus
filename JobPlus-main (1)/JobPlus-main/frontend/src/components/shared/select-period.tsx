import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface SelectPeriodProps {
  id?: string;
  label: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SelectPeriod: React.FC<SelectPeriodProps> = ({
  id,
  label,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  required = false,
  disabled = false,
  className = ""
}) => {
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startValue ? new Date(startValue) : null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endValue ? new Date(endValue) : null);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const startTimeButtonRef = useRef<HTMLButtonElement>(null);
  const endTimeButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setStartTimeOpen(false);
        setEndTimeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const formatDisplayDate = (date: Date) =>
    date.toLocaleDateString(i18n.language === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  const formatDisplayTime = (timeString: string) => timeString?.slice(0, 5);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return;
    }

    if (!tempStartDate || tempEndDate) {
      setTempStartDate(selectedDate);
      setTempEndDate(null);
      return;
    }

    if (selectedDate >= tempStartDate) {
      setTempEndDate(selectedDate);
      return;
    }

    setTempStartDate(selectedDate);
    setTempEndDate(null);
  };

  const handleTimeChange = (type: "start" | "end", timeString: string) => {
    const [hour, minute] = timeString.split(":").map(Number);
    const baseDate = type === "start" ? tempStartDate || new Date() : tempEndDate || tempStartDate || new Date();
    const updatedDate = new Date(baseDate);
    updatedDate.setHours(hour, minute);

    if (type === "start") {
      onStartChange(formatDateTime(updatedDate));
      setStartTimeOpen(false);
    } else {
      onEndChange(formatDateTime(updatedDate));
      setEndTimeOpen(false);
    }
  };

  const weekdayNames = i18n.language === "zh" ? ["日", "一", "二", "三", "四", "五", "六"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames =
    i18n.language === "zh"
      ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const isDateInRange = (day: number) => {
    if (!tempStartDate || !tempEndDate) {
      return false;
    }
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate >= tempStartDate && checkDate <= tempEndDate;
  };

  const isDateSelected = (day: number) => {
    if (!tempStartDate) {
      return false;
    }
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (checkDate.toDateString() === tempStartDate.toDateString()) {
      return "start";
    }
    if (tempEndDate && checkDate.toDateString() === tempEndDate.toDateString()) {
      return "end";
    }
    return false;
  };

  const hasValue = startValue || endValue || tempStartDate || tempEndDate || required;

  return (
    <div className={`jp-period ${className}`}>
      <div className={`jp-floating-field ${focused || hasValue || isOpen ? "is-active" : ""} ${disabled ? "is-disabled" : ""}`}>
        <button
          id={id}
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="jp-period-trigger"
        >
          <div className="jp-period-value">
            {tempStartDate ? (
              <span>
                {formatDisplayDate(tempStartDate)} {startValue ? formatDisplayTime(startValue.split("T")[1] ?? "09:00") : "09:00"}
                {" - "}
                {tempEndDate ? formatDisplayDate(tempEndDate) : formatDisplayDate(tempStartDate)}{" "}
                {endValue ? formatDisplayTime(endValue.split("T")[1] ?? "17:00") : "17:00"}
              </span>
            ) : (
              <span className="helper">Select date range</span>
            )}
          </div>
          <span className="jp-period-icon">⏱</span>
        </button>
        <label className="jp-floating-label">{label}</label>
      </div>

      {isOpen ? (
        <div ref={pickerRef} className="jp-period-panel">
          <div className="jp-period-grid">
            <div className="jp-period-calendar">
              <div className="jp-period-nav">
                <button type="button" className="jp-icon-button" onClick={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                  ‹
                </button>
                <strong>
                  {currentDate.getFullYear()} {monthNames[currentDate.getMonth()]}
                </strong>
                <button type="button" className="jp-icon-button" onClick={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                  ›
                </button>
              </div>
              <div className="jp-calendar-weekdays">
                {weekdayNames.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="jp-calendar-grid">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} />;
                  }

                  const selected = isDateSelected(day);
                  const inRange = isDateInRange(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      className={`jp-calendar-day ${inRange ? "is-range" : ""} ${selected ? `is-${selected}` : ""}`}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="jp-time-column">
              <div className="jp-time-block">
                <label>{t("period.startTime")}</label>
                <button ref={startTimeButtonRef} type="button" className="jp-compact-control" onClick={() => setStartTimeOpen((prev) => !prev)}>
                  {startValue ? formatDisplayTime(startValue.split("T")[1] ?? "09:00") : "09:00"}
                </button>
                {startTimeOpen ? (
                  <div className="jp-dropdown jp-dropdown-scroll">
                    {timeOptions.map((option) => (
                      <button key={option} className="jp-dropdown-item" onClick={() => handleTimeChange("start", option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="jp-time-block">
                <label>{t("period.endTime")}</label>
                <button ref={endTimeButtonRef} type="button" className="jp-compact-control" onClick={() => setEndTimeOpen((prev) => !prev)}>
                  {endValue ? formatDisplayTime(endValue.split("T")[1] ?? "17:00") : "17:00"}
                </button>
                {endTimeOpen ? (
                  <div className="jp-dropdown jp-dropdown-scroll">
                    {timeOptions.map((option) => (
                      <button key={option} className="jp-dropdown-item" onClick={() => handleTimeChange("end", option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="jp-period-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (tempStartDate) {
                  const start = new Date(tempStartDate);
                  const end = tempEndDate ? new Date(tempEndDate) : new Date(tempStartDate);
                  if (!startValue) {
                    start.setHours(9, 0);
                  }
                  if (!endValue) {
                    end.setHours(17, 0);
                  }
                  onStartChange(formatDateTime(start));
                  onEndChange(formatDateTime(end));
                }
                setIsOpen(false);
              }}
            >
              {t("common.done")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
