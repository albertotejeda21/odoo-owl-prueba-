/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useState } from "@odoo/owl";
import { onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

class Dashboard_api extends Component {
    static template = "ingresos_egresos_add.Dashboard_api";

setup(){

    this.state = useState({
            records: [],
            currentPage: 1,
            limit: 10, // Cantidad de bloques por página
            loading: false,
            mostrarIngresos: true, 
            mostrarGastos: true,
            egresos: [],
            ingresos: [],
            totalPages: 1


        });

onWillStart(async () => {
            await this.loadApiData();
            this.loadEgresosData()

        });
    }
    

async loadApiData() {
        this.state.loading = true;
        try {
        const url = '/dashboard/ingresos';

            const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'


            },

            
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                id: 1,
                params:{
                    page: this.state.currentPage,
                    limit: this.state.limit

                }
            })
        });




        if (!response.ok) throw new Error("error con el server");
        const result = await response.json();
        const respuestaPython = result.result;

        if (respuestaPython && respuestaPython.success) {
            this.state.ingresos = respuestaPython.data || []; 
            this.state.totalPages = respuestaPython.pages || 1; 

        } else {
            console.error("Error en Python:", respuestaPython?.error);
        }
    } catch (error){

        console.error("error en la peticion API", error);
    }finally {
        this.state.loading = false 

    }
    }

//egresos 



async loadEgresosData() {
        this.state.loading = true;
        try {
        const url = '/dashboard/egresos';

            const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'


            },

            
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                id: 1,
                params:{
                    page: this.state.currentPage,
                    limit: this.state.limit

                }
            })
        });




        if (!response.ok) throw new Error("error con el server");
        const result = await response.json();
        const respuestaPython = result.result;

        if (respuestaPython && respuestaPython.success) {
            this.state.egresos = respuestaPython.data || []; 
            this.state.totalPages = respuestaPython.pages || 1; 

        } else {
            console.error("Error en Python:", respuestaPython?.error);
        }
    } catch (error){

        console.error("error en la peticion API", error);
    }finally {
        this.state.loading = false 

    }
    }

    async prevPage() {
        if (this.state.currentPage > 1) {
            this.state.currentPage--;
            await this.loadApiData();
        }
    }

    async nextPage() {
    if (this.state.currentPage < this.state.totalPages) {
        this.state.currentPage++;
        await this.loadApiData();
    }
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


registry.category("actions").add("ingresos_egresos_add.Dashboard_api", Dashboard_api); 
