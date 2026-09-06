-- 从原文中抽出命中术语。按术语长度倒序，避免短词抢先。
-- 返回格式与教材一致：英文: Oracle; 中文: 甲骨文中国
CREATE OR REPLACE FUNCTION match_english_terms(
    p_input IN VARCHAR2
) RETURN VARCHAR2 IS
    v_result CLOB := '';
BEGIN
    FOR rec IN (
        SELECT term, translation
        FROM glossary
        WHERE REGEXP_LIKE(p_input, '(^|\W)' || term || '(\W|$)', 'i')
        ORDER BY LENGTH(term) DESC, term
    ) LOOP
        v_result := v_result || '英文: ' || rec.term || '; 中文: ' || rec.translation || CHR(10);
    END LOOP;

    IF v_result IS NULL OR LENGTH(v_result) = 0 THEN
        RETURN '（未命中术语）';
    END IF;

    IF LENGTH(v_result) > 4000 THEN
        RETURN SUBSTR(v_result, 1, 4000);
    END IF;

    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN '错误: ' || SQLERRM;
END match_english_terms;
/

-- 快速自检
-- SELECT match_english_terms('Oracle Exadata Database Machine is powerful.') FROM dual;
-- SELECT match_english_terms('Oracle Database Appliance delivers exceptional cost-effectiveness.') FROM dual;
