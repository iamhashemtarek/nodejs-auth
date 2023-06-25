/* Replace with your SQL commands */
create table users (
    id int primary key auto_increment,
    username varchar(35) not null,
    email varchar(35) not null,
    password varchar(35) not null,
    role enum('USER', "ADMIN") not null default "USER",
    isActive varchar(5) not null default 'true'
);