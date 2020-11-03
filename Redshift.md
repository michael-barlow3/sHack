# Redshift

## vasdw Schema


| vasdw | change_dimension    | change_id             | bigint                | az64 | false | 0    | true  |
| ----- | ------------------- | --------------------- | --------------------- | ---- | ----- | ---- | ----- |
| vasdw | change_dimension    | name                  | character(50)         | lzo  | false | 0    | false |
| vasdw | change_dimension    | description           | character(50)         | lzo  | false | 0    | false |
| vasdw | date_dimension      | date_id               | integer               | none | false | 1    | true  |
| vasdw | date_dimension      | full_date             | date                  | az64 | false | 0    | true  |
| vasdw | date_dimension      | au_format_date        | character(10)         | lzo  | false | 0    | true  |
| vasdw | date_dimension      | us_format_date        | character(10)         | lzo  | false | 0    | true  |
| vasdw | date_dimension      | year_number           | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | year_week_number      | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | year_day_number       | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | au_fiscal_year_number | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | us_fiscal_year_number | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | qtr_number            | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | au_fiscal_qtr_number  | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | us_fiscal_qtr_number  | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | month_number          | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | month_name            | character(9)          | lzo  | false | 0    | true  |
| vasdw | date_dimension      | month_day_number      | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | week_day_number       | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | day_name              | character(9)          | lzo  | false | 0    | true  |
| vasdw | date_dimension      | day_is_weekday        | smallint              | az64 | false | 0    | true  |
| vasdw | date_dimension      | day_is_last_of_month  | smallint              | az64 | false | 0    | true  |
| vasdw | file_dimension      | file_id               | bigint                | az64 | false | 0    | true  |
| vasdw | file_dimension      | path                  | character(50)         | lzo  | false | 0    | true  |
| vasdw | locations_dimension | location_id           | bigint                | az64 | false | 0    | true  |
| vasdw | locations_dimension | site_number           | integer               | az64 | false | 0    | false |
| vasdw | locations_dimension | station_number        | integer               | az64 | false | 0    | false |
| vasdw | locations_dimension | name                  | character(50)         | lzo  | false | 0    | false |
| vasdw | message_fact        | user_id               | integer               | az64 | false | 0    | true  |
| vasdw | message_fact        | patient_id            | integer               | az64 | false | 0    | true  |
| vasdw | message_fact        | change_id             | integer               | az64 | false | 0    | false |
| vasdw | message_fact        | location_id           | integer               | az64 | false | 0    | true  |
| vasdw | message_fact        | file_id               | integer               | az64 | false | 0    | true  |
| vasdw | message_fact        | date_id               | integer               | az64 | false | 0    | true  |
| vasdw | message_fact        | time_id               | integer               | az64 | false | 0    | true  |
| vasdw | patients_dimension  | patient_id            | bigint                | az64 | false | 0    | true  |
| vasdw | patients_dimension  | mvi                   | character(50)         | lzo  | false | 0    | false |
| vasdw | patients_dimension  | first_name            | character(50)         | lzo  | false | 0    | false |
| vasdw | patients_dimension  | last_name             | character(50)         | lzo  | false | 0    | false |
| vasdw | patients_dimension  | ssn                   | integer               | az64 | false | 0    | false |
| vasdw | time_dimension      | time_id               | integer               | az64 | false | 0    | true  |
| vasdw | time_dimension      | time_value            | character(5)          | lzo  | false | 0    | true  |
| vasdw | time_dimension      | hours_24              | character(2)          | lzo  | false | 0    | true  |
| vasdw | time_dimension      | hours_12              | character(2)          | lzo  | false | 0    | true  |
| vasdw | time_dimension      | hour_minutes          | character(2)          | lzo  | false | 0    | true  |
| vasdw | time_dimension      | day_minutes           | integer               | az64 | false | 0    | true  |
| vasdw | time_dimension      | day_time_name         | character varying(20) | lzo  | false | 0    | true  |
| vasdw | time_dimension      | day_night             | character varying(20) | lzo  | false | 0    | true  |
| vasdw | users_dimension     | user_id               | bigint                | az64 | false | 0    | true  |
| vasdw | users_dimension     | user_name             | character(50)         | lzo  | false | 0    | false |
| vasdw | users_dimension     | first_name            | character(50)         | lzo  | false | 0    | false |