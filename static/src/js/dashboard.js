/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useState } from "@odoo/owl";
import { onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

class Dashboard extends Component {
    static template = "ingresos_egresos_add.Dashboard";

setup(){


        this.orm = useService("orm");

        this.state = useState({

            ingresos: [],
            egresos: [],
            mostrarIngresos: false,
            mostrarGastos: false,
        });

        onWillStart(async () => {



    const ingresos = await this.orm.readGroup(
                "account.move.line",
                [ ["account_id.account_type", "in", ["income", "income_other"]], 
                ["move_id.state", "=", "posted"]
                ],
                ["account_id", "credit", "debit"],
                ["account_id"]
                        );


    const cuentaIds = ingresos.map(i => i.account_id[0]);
    const cuentas = await this.orm.searchRead(
    "account.account",
    [["id", "in", cuentaIds]],
    ["id", "code", "name"]
);

    this.state.ingresos = ingresos.filter(ing => ing.account_id)
    .map(ing => {
    const cuenta = cuentas.find(c => c.id === ing.account_id[0]);
    return {
        ...ing,
        codigo: cuenta ? cuenta.code : "",
        nombre: cuenta ? cuenta.name : ing.account_id[1],

    };
    });

    const egresos = await this.orm.searchRead(
                "account.move.line",
    [["account_id.account_type", "in", ["expense", "expense_depreciation", "expense_direct_cost"]], 
        ["move_id.state", "=", "posted"]
    ],
    ["name", "credit", "debit", "account_id"]
    );


    const cuentaIdsEgresos = egresos.map(e => e.account_id[0]);
    const cuentasEgresos = await this.orm.searchRead(
    "account.account",
    [["id", "in", cuentaIdsEgresos]],
    ["id", "code", "name"]




);
    this.state.egresos = egresos
    .filter(egr => egr.account_id)
    .map(egr => {
        const cuenta = cuentasEgresos.find(c => c.id === egr.account_id[0]);
        return {
            ...egr,
            codigo: cuenta ? cuenta.code : "",
            nombre: cuenta ? cuenta.name : egr.account_id[1],
        };
    });

     console.log("ingresos raw:", ingresos);
    console.log("cuentaIds:", cuentaIds);
    console.log("cuentas:", cuentas);

    console.log("cuentasEgresos:", cuentasEgresos);
    console.log("egresos mapeados:", this.state.egresos);

//**        this.state.egresos = egresos; */

});
    }


    
        ToggleIngresos() {

            this.state.mostrarIngresos = !this.state.mostrarIngresos
        }

         
        ToggleGastos() {

            this.state.mostrarGastos = !this.state.mostrarGastos 
        }


get _totalIngresos() {
    return this.state.ingresos.reduce((acc, reg) => acc + reg.credit, 0);
}
get _totalEgresos() {
    return this.state.egresos.reduce((acc, reg) => acc + reg.credit, 0);
}
get totalIngresos() {
    return this._totalIngresos.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2});
}
get totalEgresos() {
    return this._totalEgresos.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2});
}
get balance() {
    const total = this._totalIngresos - this._totalEgresos;
    return total.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2});
}

}
registry.category("actions").add("ingresos_egresos_add.Dashboard", Dashboard); 
