from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init db
db = SQLAlchemy(app)
# Init ma
ma = Marshmallow(app)


class Employees(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(100), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    country = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    wage = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Employee %r>' % self.name

class EmployeeSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'age', 'country', 'position', 'wage')

employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)


@app.route('/api/employee', methods=['POST'])
def add_employee():
    name = request.json['name']
    age = request.json['age']
    country = request.json['country']
    position = request.json['position']
    wage = request.json['wage']

    new_employee = Employees(name=name, age=age, country=country, position=position, wage=wage)

    try:
        db.session.add(new_employee)
        db.session.commit()
        return 'add Successfully', 201
    except:
        return 'Error while adding'


@app.route('/api/employees', methods=['GET'])
def get_employees():
    all_employees = Employees.query.all()
    # result = employees_schema.dump(all_employees)
    return employees_schema.jsonify(all_employees), 201


@app.route('/api/employee/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    employee = Employees.query.filter_by(id=employee_id).first()
    if not employee:
        return 'Dont have this employee', 404
    return employee_schema.jsonify(employee), 201


@app.route('/api/update/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    employee = Employees.query.filter_by(id=employee_id).first()
    if not employee:
        return 'Dont have this employee', 404
    
    name = request.json['name']
    age = request.json['age']
    country = request.json['country']
    position = request.json['position']
    wage = request.json['wage']

    employee.name = name
    employee.age = age
    employee.country = country
    employee.position = position
    employee.wage = wage
    try:
        db.session.commit()
        return 'Update Successfully', 201
    except:
        return 'Error while updating'


@app.route('/api/update/wage', methods=['PUT'])
def update_wage():
    newWage = request.json['wage']
    _id = request.json['id']
    employee = Employees.query.filter_by(id=_id).first()
    if not employee: 
        return 'Dont have this employee', 404
    employee.wage = newWage
    try:
        db.session.commit()
        return 'Update wage Successfully', 201
    except:
        return 'Error while updating wage'


@app.route('/api/delete/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    employee = Employees.query.filter_by(id=employee_id).first()
    if not employee:
        return 'Dont have this employee', 404
    try:
        db.session.delete(employee)
        db.session.commit()
        return 'Delete Successfully', 201
    except:
        return 'Error while deleting'


if __name__ == '__main__':
    app.run(debug=True)