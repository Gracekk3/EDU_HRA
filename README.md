# Web Quest – Code Runner 🎮

**Vzdělávací arkádová hra o tvorbě webových stránek.** Hráč ovládá pohybující se dron a chytá padající bloky s odpověďmi na otázky z HTML, CSS a JavaScriptu. Hra má 15 otázek rozdělených do 3 misí.

## Jak hrát

1. Otevři `index.html` a stiskni **Spustit hru**.
2. Přečti otázku nad herní plochou. Padají čtyři možné odpovědi.
3. Ovládej dron **šipkami vlevo/vpravo**, **A/D**, případně tlačítky **◀ ▶** na dotykové obrazovce.
4. Chyť správnou odpověď. Po výběru se zobrazí vysvětlení, i když odpovíš špatně.
5. Pokračuj přes **Další výzva** až po závěrečné vyhodnocení.

## Vzdělávací záměr

Hra ukazuje základní principy tvorby webových stránek:

- **HTML (5 otázek):** struktura stránky, nadpisy, odstavce, odkazy, obrázky a atributy.
- **CSS (5 otázek):** stylování, barvy, selektory, Flexbox a responzivita.
- **JavaScript a web (5 otázek):** interaktivita, výběr prvků, události, HTTPS a localStorage.

Ke každé otázce hra poskytuje výukové vysvětlení správné odpovědi, takže jde o učení prostřednictvím zpětné vazby, nejen o test.

## Proč je hra zábavná?

- Pohyb dronu a animované padající možnosti namísto obyčejného dotazníku.
- Rychlejší pád bloků v dalších misích.
- Zvuková odezva na úspěch a chybu.
- 3 životy, body XP a bonusy za sérii správných odpovědí.
- Po vyčerpání životů lze otázky dokončit v tréninkovém režimu.

## Jak měříme dosažený pokrok?

- Počet správných odpovědí **z 15**.
- Celková procentuální úspěšnost: **správné odpovědi / 15 × 100**.
- Úspěšnost jednotlivých tří tematických oblastí (**0–5 správných** v každé misi).
- XP: **100 bodů** za správnou odpověď a bonus **až 50 bodů** za správnou sérii.
- Osobní rekord, nejlepší úspěšnost a počet dokončených her ukládáme do `localStorage` v daném prohlížeči.

Zlepšení lze sledovat porovnáním výsledků z více průchodů a hledáním slabších témat. Hra není oficiální diagnostika znalostí, ale jednoduchá měřitelná zpětná vazba.

## Technologie a soubory

- `index.html` – rozložení stránky, herní plocha a obrazovky.
- `style.css` – barvy, responzivní design a animace.
- `script.js` – otázky, logika hry, animovaný pohyb (`requestAnimationFrame`), detekce kolizí a ukládání výsledků.

Hra funguje bez frameworků, instalace a serverové části.

## Publikace na GitHub Pages

1. Vytvoř veřejný repozitář např. `web-quest`.
2. Nahraj všechny 4 soubory **do kořene repozitáře**.
3. Přejdi do **Settings → Pages**.
4. Vyber **Deploy from a branch**, větev `main`, složku `/(root)` a potvrď.
5. Po zveřejnění odevzdej **dva odkazy**:

- GitHub: `https://github.com/TVE-JMENO/web-quest`
- Hra: `https://TVE-JMENO.github.io/web-quest/`

*Adresy jsou příklady: nahraď TVE-JMENO svým GitHub uživatelským jménem.*
