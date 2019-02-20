--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

-- Started on 2018-03-04 23:41:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2912 (class 1262 OID 16394)
-- Name: audit; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE audit WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';


ALTER DATABASE audit OWNER TO postgres;

\connect audit

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2913 (class 0 OID 0)
-- Dependencies: 2912
-- Name: DATABASE audit; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE audit IS 'Audit app DB';


--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2915 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 16515)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 2916 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 16504)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2917 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 226 (class 1255 OID 16552)
-- Name: hash_password(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.hash_password() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF NEW.password IS NULL THEN
		RAISE EXCEPTION 'password cannot be null';
	END IF;
	NEW.password := crypt(NEW.password, gen_salt('bf'));
	RETURN NEW;
END;	
$$;


ALTER FUNCTION public.hash_password() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 205 (class 1259 OID 16457)
-- Name: audit_issue_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_issue_values (
    issue_id integer NOT NULL,
    issue_type text,
    issue_value integer,
    deactivated boolean
);


ALTER TABLE public.audit_issue_values OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16455)
-- Name: audit_issue_values_issueID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."audit_issue_values_issueID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."audit_issue_values_issueID_seq" OWNER TO postgres;

--
-- TOC entry 2918 (class 0 OID 0)
-- Dependencies: 204
-- Name: audit_issue_values_issueID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."audit_issue_values_issueID_seq" OWNED BY public.audit_issue_values.issue_id;


--
-- TOC entry 206 (class 1259 OID 16466)
-- Name: audit_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_issues (
    audit_issue_id uuid NOT NULL,
    audit_id uuid,
    issue_id integer,
    issue_note text,
    issue_status_id integer,
    resolved_on timestamp with time zone,
    dispute_note text,
    dispute_accepted boolean,
    admin_note text
);


ALTER TABLE public.audit_issues OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16420)
-- Name: audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audits (
    audit_id uuid NOT NULL,
    assigned_to uuid,
    analyst_audited uuid,
    created_on timestamp with time zone,
    is_complete boolean,
    completed_on timestamp with time zone,
    development_id text,
    url text,
    selling_status_id integer,
    leasing_status_id integer,
    total_score integer
);


ALTER TABLE public.audits OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16446)
-- Name: issue_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issue_statuses (
    issue_status_id integer NOT NULL,
    issue_status_type text
);


ALTER TABLE public.issue_statuses OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16444)
-- Name: issue_statuses_issueStatusID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."issue_statuses_issueStatusID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."issue_statuses_issueStatusID_seq" OWNER TO postgres;

--
-- TOC entry 2919 (class 0 OID 0)
-- Dependencies: 202
-- Name: issue_statuses_issueStatusID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."issue_statuses_issueStatusID_seq" OWNED BY public.issue_statuses.issue_status_id;


--
-- TOC entry 200 (class 1259 OID 16405)
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    permission_level_id integer NOT NULL,
    permission_type text
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 16403)
-- Name: user_permissions_permissionLevelID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."user_permissions_permissionLevelID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."user_permissions_permissionLevelID_seq" OWNER TO postgres;

--
-- TOC entry 2920 (class 0 OID 0)
-- Dependencies: 199
-- Name: user_permissions_permissionLevelID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."user_permissions_permissionLevelID_seq" OWNED BY public.user_permissions.permission_level_id;


--
-- TOC entry 198 (class 1259 OID 16395)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid NOT NULL,
    name text,
    email text,
    title text,
    password text,
    permission_level_id integer,
    additional_audits integer,
    is_auditing boolean,
    is_audited boolean,
    deactivated boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 2751 (class 2604 OID 16460)
-- Name: audit_issue_values issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_issue_values ALTER COLUMN issue_id SET DEFAULT nextval('public."audit_issue_values_issueID_seq"'::regclass);


--
-- TOC entry 2750 (class 2604 OID 16449)
-- Name: issue_statuses issue_status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_statuses ALTER COLUMN issue_status_id SET DEFAULT nextval('public."issue_statuses_issueStatusID_seq"'::regclass);


--
-- TOC entry 2749 (class 2604 OID 16408)
-- Name: user_permissions permission_level_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions ALTER COLUMN permission_level_id SET DEFAULT nextval('public."user_permissions_permissionLevelID_seq"'::regclass);


--
-- TOC entry 2906 (class 0 OID 16466)
-- Dependencies: 206
-- Data for Name: audit_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2901 (class 0 OID 16420)
-- Dependencies: 201
-- Data for Name: audits; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2903 (class 0 OID 16446)
-- Dependencies: 203
-- Data for Name: issue_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.issue_statuses (issue_status_id, issue_status_type) VALUES (1, 'open');
INSERT INTO public.issue_statuses (issue_status_id, issue_status_type) VALUES (2, 'disputed');
INSERT INTO public.issue_statuses (issue_status_id, issue_status_type) VALUES (3, 'resolved');


--
-- TOC entry 2900 (class 0 OID 16405)
-- Dependencies: 200
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_permissions (permission_level_id, permission_type) VALUES (1, 'analyst');
INSERT INTO public.user_permissions (permission_level_id, permission_type) VALUES (2, 'management');
INSERT INTO public.user_permissions (permission_level_id, permission_type) VALUES (3, 'analyst admin');


--
-- TOC entry 2921 (class 0 OID 0)
-- Dependencies: 204
-- Name: audit_issue_values_issueID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."audit_issue_values_issueID_seq"', 35, true);


--
-- TOC entry 2922 (class 0 OID 0)
-- Dependencies: 202
-- Name: issue_statuses_issueStatusID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."issue_statuses_issueStatusID_seq"', 3, true);


--
-- TOC entry 2923 (class 0 OID 0)
-- Dependencies: 199
-- Name: user_permissions_permissionLevelID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."user_permissions_permissionLevelID_seq"', 3, true);


--
-- TOC entry 2764 (class 2606 OID 16465)
-- Name: audit_issue_values audit_issue_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_issue_values
    ADD CONSTRAINT audit_issue_values_pkey PRIMARY KEY (issue_id);


--
-- TOC entry 2766 (class 2606 OID 16473)
-- Name: audit_issues audit_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_issues
    ADD CONSTRAINT audit_issues_pkey PRIMARY KEY (audit_issue_id);


--
-- TOC entry 2758 (class 2606 OID 16427)
-- Name: audits audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 2762 (class 2606 OID 16454)
-- Name: issue_statuses issue_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_statuses
    ADD CONSTRAINT issue_statuses_pkey PRIMARY KEY (issue_status_id);


--
-- TOC entry 2756 (class 2606 OID 16413)
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (permission_level_id);


--
-- TOC entry 2754 (class 2606 OID 16402)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2759 (class 1259 OID 16479)
-- Name: fki_assigned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_assigned ON public.audits USING btree (assigned_to);


--
-- TOC entry 2767 (class 1259 OID 16491)
-- Name: fki_audit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_audit ON public.audit_issues USING btree (audit_id);


--
-- TOC entry 2760 (class 1259 OID 16485)
-- Name: fki_audited; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_audited ON public.audits USING btree (analyst_audited);


--
-- TOC entry 2768 (class 1259 OID 16497)
-- Name: fki_issue; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_issue ON public.audit_issues USING btree (issue_id);


--
-- TOC entry 2769 (class 1259 OID 16503)
-- Name: fki_issueStatus; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_issueStatus" ON public.audit_issues USING btree (issue_status_id);


--
-- TOC entry 2752 (class 1259 OID 16419)
-- Name: fki_permissions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_permissions ON public.users USING btree (permission_level_id);


--
-- TOC entry 2776 (class 2620 OID 16553)
-- Name: users hash_password; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER hash_password BEFORE INSERT OR UPDATE OF password ON public.users FOR EACH ROW EXECUTE PROCEDURE public.hash_password();


--
-- TOC entry 2773 (class 2606 OID 16486)
-- Name: audit_issues audit_issues_auditID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_issues
    ADD CONSTRAINT "audit_issues_auditID_fkey" FOREIGN KEY (audit_id) REFERENCES public.audits(audit_id);


--
-- TOC entry 2774 (class 2606 OID 16492)
-- Name: audit_issues audit_issues_issueID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_issues
    ADD CONSTRAINT "audit_issues_issueID_fkey" FOREIGN KEY (issue_id) REFERENCES public.audit_issue_values(issue_id);


--
-- TOC entry 2775 (class 2606 OID 16498)
-- Name: audit_issues audit_issues_issueStatusID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_issues
    ADD CONSTRAINT "audit_issues_issueStatusID_fkey" FOREIGN KEY (issue_status_id) REFERENCES public.issue_statuses(issue_status_id);


--
-- TOC entry 2772 (class 2606 OID 16480)
-- Name: audits audits_analystAudited_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT "audits_analystAudited_fkey" FOREIGN KEY (analyst_audited) REFERENCES public.users(user_id);


--
-- TOC entry 2771 (class 2606 OID 16474)
-- Name: audits audits_assignedTo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT "audits_assignedTo_fkey" FOREIGN KEY (assigned_to) REFERENCES public.users(user_id);


--
-- TOC entry 2770 (class 2606 OID 16414)
-- Name: users users_permissionLevelID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_permissionLevelID_fkey" FOREIGN KEY (permission_level_id) REFERENCES public.user_permissions(permission_level_id);


-- Completed on 2018-03-04 23:41:37

--
-- PostgreSQL database dump complete
--

