{
    'name': 'ingresos_egresos_add',
    'version': '1.0',
    'depends': ['base', 'account', 'web'],
    'data': [
        'views/dashboard_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'ingresos_egresos_add/static/src/js/dashboard.js',
            'ingresos_egresos_add/static/src/xml/dashboard.xml',
        ],
    },
}