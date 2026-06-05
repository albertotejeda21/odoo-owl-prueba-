from odoo import http
from odoo.http import request
import math

class TradeController(http.Controller):
    
#HACER QUR FUNCIONEN LAS 2
 
    @http.route('/trade/expediente/<int:id>', auth='public', type='http')
    def get_expediente_id(self, id, **kwargs):
        return str(id)
    
    @http.route('/dashboard/ingresos', auth='public', type='json', methods=['POST'], csrf=False)
    def get_ingresos_data(self, page=1, limit=50, **kwargs):
        try:
            page = int(page)
            limit = int(limit)
            
            domain = [
                ("account_id.account_type", "in", ["income", "income_other"]),
                ("move_id.state", "=", "posted")
            ]
            
            total = request.env['account.move.line'].sudo().search_count(domain)
            
            registros = request.env['account.move.line'].sudo().search_read(
                domain=domain,
                fields=["account_id", "credit", "debit"],
                limit=limit,
                offset=(page - 1) * limit
            )
            
            account_ids = [r['account_id'][0] for r in registros if r.get('account_id')]
            cuentas = request.env['account.account'].sudo().search_read(
                [['id', 'in', account_ids]],
                ['id', 'code', 'name']
            )
            
            cuentas_dict = {c['id']: c for c in cuentas}
            
            for reg in registros:
                if reg.get('account_id'):
                    cuenta = cuentas_dict.get(reg['account_id'][0], {})
                    reg['codigo'] = cuenta.get('code', '')
                    reg['nombre'] = cuenta.get('name', '')
            
            return {
                'success': True,
                'data': registros,
                'total': total,
                'page': page,
                'pages': math.ceil(total / limit) if limit > 0 else 1
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    @http.route('/dashboard/egresos', auth='public', type='json', methods=['POST'], csrf=False)
    def get_egresos_data(self, page=1, limit=50, **kwargs):
            
        page = int(page)
        limit = int(limit)
        try:
            domain = [
                ("account_id.account_type", "in", ["expense", "expense_depreciation", "expense_direct_cost"]), 
                ("move_id.state", "=", "posted")
            ]
            
            total = request.env['account.move.line'].sudo().search_count(domain)

            
            registros = request.env['account.move.line'].sudo().search_read(
                domain=domain,
                fields=["account_id", "credit", "debit"],
                limit=limit,
                offset=(page - 1) * limit
            )

            account_ids = [r['account_id'][0] for r in registros if r.get('account_id')]
            cuentas = request.env['account.account'].sudo().search_read(
                [['id', 'in', account_ids]],
                ['id', 'code', 'name']
            )

            cuentas_dict = {c['id']: c for c in cuentas}
            
            for reg in registros:
                if reg.get('account_id'):
                    cuenta = cuentas_dict.get(reg['account_id'][0], {})
                    reg['codigo'] = cuenta.get('code', '')
                    reg['nombre'] = cuenta.get('name', '')
            
            total_pages = math.ceil(total / limit) if limit > 0 else 1
            
            return {    
                'success': True,
                'data': registros,
                'total': total,
                'page': page,
                'pages': total_pages
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }