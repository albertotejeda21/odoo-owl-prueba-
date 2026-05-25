from odoo import http
from odoo.http import request
import math

class TradeController(http.Controller):
    
#HACER QUR FUNCIONEN LAS 2


    @http.route('/trade/expediente/<int:id>', auth='public', type='http')
    def get_expediente_id(self, id, **kwargs):
        return str(id)

    @http.route('/dashboard/ingresos', auth='public', type='json', methods=['GET'], csrf=False)
    def get_ingresos_data(self, page=1, limit=50, **kwargs):
        
        try:
            domain = [
                ("account_id.account_type", "in", ["income", "income_other"]),
                ("move_id.state", "=", "posted")
            ]
            
            total = request.env['account.move.line'].sudo().search_count(domain)
            
            registros = request.env['account.move.line'].sudo().search_read(
                domain=domain,
                fields=["account_id", "credit", "debit"],
                limit=int (limit),
                offset=(page - 1) * limit
            )
            
            total_pages = math.ceil(total / limit) if limit > 0 else 1
            
            return {    
                'success': True,
                'data': registros,
                'total': total,
                'page':int  (page),
                'pages': total_pages
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }



#otro

    @http.route('/dashboard/egresos', auth='public', type='json', methods=['GET'], csrf=False)
    def get_egresos_data(self, page=1, limit=50, **kwargs):
        
        try:
            domain = [
                #("account_id.account_type", "in", ["income", "income_other"]),
                ("account_id.account_type", "in", ["expense", "expense_depreciation","expense_direct_cost"]), 
                ("move_id.state", "=", "posted")
            ]
            
            total = request.env['account.move.line'].sudo().search_count(domain)
            page = int(page)
            limit = int(limit)
            
            registros = request.env['account.move.line'].sudo().search_read(
                domain=domain,
                fields=["account_id", "credit", "debit"],
                limit=int (limit),
                offset=(page - 1) * limit
            )
            
            total_pages = math.ceil(total / limit) if limit > 0 else 1
            
            return {    
                'success': True,
                'data': registros,
                'total': total,
                'page':int  (page),
                'pages': total_pages
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


            
