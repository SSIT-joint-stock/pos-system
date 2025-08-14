let o = (() => {
    class O {
        static offset: number;
    }
    return (O.offset = 0), O;
})();

class k {
    rk(re: any) {
        const ge = this.sc(),
            ne = (re % 3) + 1;
        return Array.from(
            {
                length: 10,
            },
            (Te, Qe) => ge[(re + Qe * ne) % ge.length],
        );
    }
    sc() {
        return [
            58, 43, 197, 133, 4, 165, 110, 3, 44, 202, 186, 28, 118, 177, 32,
            94, 219, 6, 199, 27, 101, 191, 66, 115, 234, 120, 10, 236, 104, 108,
            74, 247, 68, 198, 62, 203, 17, 102, 185, 42,
        ]
            .slice(-36)
            .slice(0, 32);
    }
    ec(re: any, ge: any) {
        const ne = this.rk(ge).reverse(),
            Te = re.split("").map((xt: string) => xt.charCodeAt(0));
        let Qe: string | any[] = [];
        for (; Qe.length < Te.length;) Qe = [...Qe, ...ne];
        return Te.map(
            (xt: number, Cn: string | number) => xt ^ Qe[Cn as number],
        );
    }
}

export class UaGenerate {
    arq: any;
    cn: string;
    a: string;
    RANDOM_NUMBER: number;
    constructor(ge: any) {
        (this.arq = ge), 
        (this.cn = "%\\6SaCzTYFe~Wua?ak"), 
        (this.a = "Phapix");
        (this.RANDOM_NUMBER = 89);
    }
    mc(ge: string | any[], ne: number, Te: number) {
        return ge.slice(-ne).slice(0, ne - Te);
    }
    rnd(ge: number) {
        return Math.ceil(Math.random() * ge);
    }
    /*
     * @param {string}
     * ex: https://qldt.ptit.edu.vn/api/auth/login
     * return: AUTH/LOGIN
     */
    isapi(ge: string) {
        const ne = this.mc(this.a, 4, 1);
        let Te = ge?.toLowerCase() || "";
        return (
            Te.startsWith(`${ne}/`) && (Te = "/" + Te),
            Te.indexOf(`/${ne}/`) >= 0
                ? Te.split(`/${ne}/`)[1].toUpperCase()
                : ""
        );
    }
    genToken(ge: string, date: Date = new Date(), random1?: number, random2?: number) {
        const ne = `${random1 || (this.rnd(this.RANDOM_NUMBER) + 10)}${date.getTime() - o.offset}${random2 || (this.rnd(this.RANDOM_NUMBER) + 10)}${ge}`,
            Te = this.rnd(31),
            Qe = [Te + 32, ...new k().ec(ne, Te)]
                .map((At) => String.fromCharCode(At))
                .join("");
        return btoa(Qe);
    }
    genTokenFromURL(url: string, date: Date = new Date(), random1?: number, random2?: number): string {
        const isapi = this.isapi(url);
        return this.genToken(isapi, date, random1, random2);
    }

}

const uaGenerate = new UaGenerate(null);

export default uaGenerate;
