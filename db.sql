/*
  Aluno:..... Felipe Helfensteler Beskow
  RA:........ 1581201
  Disciplina: Linguagem Procedural de Banco de Dados
  Professor:. Me. Cesar Angonese
  Data:...... 16/11/2022
*/

alter session set "_ORACLE_SCRIPT"=true;

grant create user to system;
create user ppl identified by ppl;
alter user ppl quota unlimited on USERS;
grant create session to ppl;

create table ppl.ficha(
  codigo number not null,
  nome varchar(420) not null,
  cpf varchar2(45),
  email varchar2(420),
  telefone varchar2(45),
  cidade varchar2(45),
  uf varchar2(2),
  data_registro date not null,
  constraint ficha_pk primary key(codigo)
);

create sequence ppl.ficha_s1 start with 1000;

create table ppl.filiado(
  codigo number not null,
  nome varchar(420) not null,
  cpf varchar2(45),
  email varchar2(420),
  telefone varchar2(45),
  cidade varchar2(45),
  uf varchar2(2),
  cod_ficha number not null,
  data_registro date not null,
  data_alteracao date not null,
  constraint filiacao_pk primary key(codigo),
  constraint ficha_filiacao_fk foreign key(cod_ficha) references ppl.ficha(codigo)
);

create sequence ppl.filiado_s1 start with 1000;

create table ppl.filiado_hist as select * from filiado where 1 = 0;

create table ppl.contribuicao(
  codigo number not null,
  cod_filiado number not null,
  valor number not null,
  periodo_referencial date not null,
  cod_usuario number not null,
  data_registro date not null,
  constraint contribuicao_pk primary key (codigo),
  constraint filiado_contribuicao_fk foreign key (cod_filiado) references ppl.filiado(codigo),
  constraint usuario_contribuicao_fk foreign key (cod_usuario) references ppl.usuario(codigo)
);

create sequence ppl.contribuicao_s1 start with 1000;


create or replace trigger ppl.ficha_t1 
before insert or update or delete 
on ppl.ficha for each row
declare
  update_nao_permitido exception;
  pragma exception_init (update_nao_permitido,-12081);
begin
  if inserting then
    :new.data_registro := sysdate;
  else
    rollback;
    raise update_nao_permitido;
  end if;
exception
    when update_nao_permitido then
      raise_application_error(-20001,'N�o � permitido alterar a tabela');
    when others then
      raise_application_error(sqlcode,sqlerrm);
end;

create or replace trigger ppl.filiado_t1 
before insert or update or delete 
on ppl.filiado for each row
begin
  if inserting then
    :new.data_registro := sysdate;
  else
    insert into ppl.filiado_hist(codigo,nome,cpf,email,telefone,cidade,uf,cod_ficha,data_registro,data_alteracao) 
    values (:old.codigo,:old.nome,:old.cpf,:old.email,:old.telefone,:old.cidade,:old.uf,:old.cod_ficha,:old.data_registro,:old.data_alteracao);
  end if;
  :new.data_alteracao := sysdate;
exception
    when others then
      raise_application_error(sqlcode,sqlerrm);
end;

create or replace trigger ppl.contribuicao_t1 
before insert or update or delete 
on ppl.contribuicao for each row
declare
  update_nao_permitido exception;
  pragma exception_init (update_nao_permitido,-12081);
begin
  if inserting then
    :new.data_registro := sysdate;
  else
    rollback;
    raise update_nao_permitido;
  end if;
exception
    when update_nao_permitido then
      raise_application_error(-20001,'N�o � permitido alterar a tabela');
    when others then
      raise_application_error(sqlcode,sqlerrm);
end;

create or replace package ppl.pkg_ficha as
  procedure insere(
    p_nome ficha.nome%type,
    p_cpf ficha.cpf%type,
    p_email ficha.email%type,
    p_telefone ficha.telefone%type,
    p_cidade ficha.cidade%type,
    p_uf ficha.uf%type
  );
  procedure homologar(
    p_codigo_ficha ficha.codigo%type
  );
end;

create or replace package body ppl.pkg_ficha as
  procedure insere(
    p_nome ficha.nome%type,
    p_cpf ficha.cpf%type,
    p_email ficha.email%type,
    p_telefone ficha.telefone%type,
    p_cidade ficha.cidade%type,
    p_uf ficha.uf%type
  ) as
  begin
    insert into ficha(codigo,nome,cpf,email,telefone,cidade,uf) 
    values(ficha_s1.nextval,p_nome,p_cpf,p_email,p_telefone,p_cidade,p_uf);
  end;
  
  procedure homologar(
    p_codigo_ficha ficha.codigo%type
  ) as
  begin
    for ficha in (
      select codigo,nome,cpf,telefone,cidade,uf
      from ficha where codigo = p_codigo_ficha
    ) loop
      insert into filiado(codigo,nome,cpf,telefone,cidade,uf,cod_ficha) 
      values (filiado_s1.nextval,ficha.nome,ficha.cpf,ficha.telefone,ficha.cidade,ficha.uf,ficha.codigo);
    end loop;
  end;
end;

create or replace view ppl.ficha_v as
select 
  codigo, 
  nome, 
  cpf, 
  email, 
  telefone, 
  cidade, 
  uf, 
  data_registro 
from 
  ppl.ficha
where 
  not exists (
    select 1 from ppl.filiado
    where filiado.cod_ficha = ficha.codigo)
;